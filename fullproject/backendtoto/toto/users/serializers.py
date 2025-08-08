from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Team, Member, Task

class TaskSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='content')  # 예: 'taskName'이면 그대로, 'content'면 source='content'
    priority = serializers.IntegerField(min_value=1, max_value=5, required=False, default=1)
    
    class Meta:
        model = Task
        fields = ['taskNum', 'title', 'priority', 'done', 'usernum']
        read_only_fields = ['usernum'] 
        
class MemberSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    
    class Meta:
        model = Member
        fields = '__all__'  
        read_only_fields = ['tasks']

class TeamSerializer(serializers.ModelSerializer):
    members = MemberSerializer(many=True, read_only=True)
    password = serializers.CharField(write_only=True)
    class Meta:
        model = Team
        fields = ['teamName', 'password', 'members']
        
    def create(self, validated_data):
        password = validated_data.pop('password')
        team = Team(**validated_data)
        team.set_password(password)  # 해시 저장
        team.save()
        return team