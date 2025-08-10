from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import MinValueValidator, MaxValueValidator


class UserManager(BaseUserManager):
    def _create_user(self, teamName, password, **extra_fields):
        team = self.model(teamName=teamName, **extra_fields)
        team.set_password(password)
        team.save(using=self._db)
        return team

    def create_user(self, teamName, password, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(teamName, password, **extra_fields)

    def create_superuser(self, teamName, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(teamName, password, **extra_fields)

class Team(AbstractBaseUser, PermissionsMixin):
    teamName = models.CharField(max_length=10, unique=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'teamName'
    objects = UserManager()

    @property
    def teamPW(self):
        return self.password

    @teamPW.setter
    def teamPW(self, raw_pw):
        self.set_password(raw_pw)

    def __str__(self):
        return self.teamName

#members
class Member(models.Model):
    team = models.ForeignKey(Team, related_name='members', on_delete=models.CASCADE, db_column='teamNum')
    userNum = models.AutoField(db_column='userNum', primary_key=True)
    userID = models.CharField(db_column='userID', max_length=12)

    class Meta:
        unique_together = ('team', 'userID')

    def __str__(self):
        return self.userID

#task
class Task(models.Model):
    usernum = models.ForeignKey('users.Member', related_name='tasks', on_delete=models.CASCADE, db_column='userNum')
    taskNum = models.AutoField(db_column='taskNum', primary_key=True)
    content = models.TextField()
    done = models.BooleanField(default=False)
    priority = models.IntegerField(
        db_column='import',
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )

    class Meta:
        ordering = ['-priority']

    def __str__(self):
        return self.content
