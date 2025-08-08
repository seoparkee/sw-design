from django.urls import path
from .views import (
    LoginView,
    CSRFTokenView,
    TeamListView,
    TeamMemberListView,
    TaskListView,          # /members/<usernum>/tasks/ : 내/팀원 할 일 조회 + (내 것) 생성
    TaskDetailView,        # /tasks/<taskNum>/         : 개별 할 일 조회/수정/삭제(본인만)
)

app_name = "users"

urlpatterns = [
    # 인증
    path('login/', LoginView.as_view(), name='login'),
    path('csrf/', CSRFTokenView.as_view(), name='csrf'),  # Token 인증이면 사실 필요 없음

    # 팀 정보
    path('team/<str:teamName>/', TeamListView.as_view(), name='team-by-name'),
    path('team/<int:teamnum>/members/', TeamMemberListView.as_view(), name='team-members'),

    # 할 일조아이제깔끔해졌ㅇ
    path('member/<int:usernum>/tasks/', TaskListView.as_view(), name='member-tasks'),
    path('tasks/<int:taskNum>/', TaskDetailView.as_view(), name='task-detail'),
]
