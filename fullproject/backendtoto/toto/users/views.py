from django.contrib.auth.hashers import identify_hasher
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view

from .models import Team, Member, Task
from .serializers import TeamSerializer, MemberSerializer, TaskSerializer


@method_decorator(ensure_csrf_cookie, name='dispatch')
class CSRFTokenView(APIView):
    # 토큰 인증을 쓰면 사실 꼭 필요하진 않지만, 유지해도 무해
    permission_classes = [AllowAny]

    def get(self, request):
        return JsonResponse({'message': 'CSRF cookie set'})

def _is_hashed(pw: str) -> bool:
    try:
        identify_hasher(pw)  
        return True
    except Exception:
        return False


class LoginView(APIView):
    # 전역 기본 권한이 IsAuthenticated여도, 로그인은 누구나 접근 가능해야 함
    permission_classes = [AllowAny]
    # 로그인 시에 굳이 인증 시도하지 않도록 비움(권장)
    authentication_classes = []

    def post(self, request):
        teamName = request.data.get('teamName')
        password = request.data.get('password')
        userID = request.data.get('userID')

        if not (teamName and password and userID):
            return Response(
                {"message": "정보가 누락되었습니다.", "action": "Error"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 1) 팀 존재하면 → 비번 검사 후 멤버 조회/생성 → 토큰 발급
        try:
            team = Team.objects.get(teamName=teamName)

               # 1) 현재 저장된 패스워드가 해시인지 확인
            if _is_hashed(team.password):
                # 정상 해시 → Django 방식으로 검사
                if not team.check_password(password):
                    return Response({"message":"비밀번호가 틀렸습니다","action":"Wrong_password"}, status=401)
            else:
                # 레거시 평문 저장 → 평문이 맞으면 즉시 해시로 업그레이드
                if password != team.password:
                    return Response({"message":"비밀번호가 틀렸습니다","action":"Wrong_password"}, status=401)
                team.set_password(password)
                team.save(update_fields=['password'])


            member = Member.objects.filter(team=team, userID=userID).first()
            if not member:
                member = Member.objects.create(team=team, userID=userID)

            member_data = MemberSerializer(member).data
            member_data.update({"teamnum": team.id, "teamname": team.teamName})

            token, _ = Token.objects.get_or_create(user=team)

            return Response({
                "message": "로그인",
                "action": "Login",
                "token": token.key,
                "user": member_data,
            }, status=status.HTTP_200_OK)

        # 2) 팀이 없으면 → 팀 생성(비번 해시 저장) + 멤버 생성 → 토큰 발급
        except Team.DoesNotExist:
            # TeamSerializer가 set_password를 호출하여 해시 저장하도록 구현되어 있어야 함
            team_serializer = TeamSerializer(data={"teamName": teamName, "password": password})
            if not team_serializer.is_valid():
                return Response(
                    {"message": "팀 생성 실패", "errors": team_serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )

            new_team = team_serializer.save()
            new_member = Member.objects.create(team=new_team, userID=userID)

            member_data = MemberSerializer(new_member).data
            member_data.update({"teamnum": new_team.id, "teamname": new_team.teamName})

            token, _ = Token.objects.get_or_create(user=new_team)

            return Response({
                "message": "팀 및 멤버 생성",
                "action": "Create_team",
                "token": token.key,
                "user": member_data,
            }, status=status.HTTP_201_CREATED)


class TaskListView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    # 권한은 전역 기본(IsAuthenticated)을 따름

    def get_queryset(self):
        usernum = self.kwargs['usernum']
        member = get_object_or_404(Member, pk=usernum)
        return Task.objects.filter(usernum=member)

    def perform_create(self, serializer):
        usernum = self.kwargs.get('usernum')
        member = get_object_or_404(Member, pk=usernum)
        serializer.save(usernum=member)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    lookup_field = 'taskNum'
    # 권한은 전역 기본(IsAuthenticated)을 따름

    def get_queryset(self):
        return Task.objects.all()

    def delete(self, request, *args, **kwargs):
        task = self.get_object()
        if str(task.usernum.pk) != str(request.data.get('member')):
            return Response({'error': '삭제 권한이 없습니다.'}, status=403)
        return super().delete(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        task = self.get_object()
        if str(task.usernum.pk) != str(request.data.get('member')):
            return Response({'error': '수정 권한이 없습니다.'}, status=403)
        return super().put(request, *args, **kwargs)


class TeamMemberListView(APIView):
    # 권한은 전역 기본(IsAuthenticated)을 따름
    def get(self, request, teamnum):
        team = get_object_or_404(Team, id=teamnum)
        members = Member.objects.filter(team=team)
        serializer = MemberSerializer(members, many=True)
        return Response({"members": serializer.data}, status=status.HTTP_200_OK)


class TeamListView(APIView):
    # 권한은 전역 기본(IsAuthenticated)을 따름
    def get(self, request, teamName):
        try:
            team = Team.objects.get(teamName=teamName)
            serializer = TeamSerializer(team)
            return Response(serializer.data)
        except Team.DoesNotExist:
            return Response({'error': 'Team not found'}, status=404)


@api_view(['GET'])
def home_view(request, user_id):
    # 권한은 전역 기본(IsAuthenticated)을 따름
    tasks = Task.objects.filter(usernum_id=user_id)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
def task_detail(request, taskNum):
    # 권한은 전역 기본(IsAuthenticated)을 따름
    try:
        task = Task.objects.get(pk=taskNum)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=404)

    if str(task.usernum.pk) != str(request.data.get('member')):
        return Response({"error": "Permission denied"}, status=403)

    task.delete()
    return Response({"message": f"Task {taskNum} deleted successfully."}, status=204)
