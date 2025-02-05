from django.urls import path
from .views import RoomList, CreateRoom, JoinRoom, RoomDetail, UserRoomStatus, LeaveRoom

urlpatterns = [
    path('rooms/', RoomList.as_view(), name='room-list'),
    path('create-room/', CreateRoom.as_view(), name='create-room'),
    path('join-room/', JoinRoom.as_view(), name='join-room'),
    path('room-detail/', RoomDetail.as_view(), name='room-detail'),
    path('user-room-status/', UserRoomStatus.as_view(), name='user-room-status'),
    path('leave-room/', LeaveRoom.as_view(), name='leave-room'),
]
