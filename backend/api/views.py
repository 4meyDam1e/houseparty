from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from django.http import JsonResponse
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer


# Session key for storing the room code
SESSION_ROOM_CODE = 'room_code'

class RoomList(generics.ListAPIView):
    """
    API endpoint to list all rooms.
    """
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class CreateRoom(APIView):
    """
    API endpoint to create a new room or update an existing one for the host.
    """
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):

        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.validated_data['guest_can_pause']
            votes_to_skip = serializer.validated_data['votes_to_skip']
            host = self.request.session.session_key

            # Check if the host already has a room
            room, created = Room.objects.update_or_create(
                host=host,
                defaults={
                    'guest_can_pause': guest_can_pause,
                    'votes_to_skip': votes_to_skip
                }
            )

            self.request.session[SESSION_ROOM_CODE] = room.code
            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class JoinRoom(APIView):
    """
    API endpoint to join a room by its code.
    """
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        print("SESSION DATA:", self.request.session.items())  # Debugging line

        if not self.request.session.exists(self.request.session.session_key):
            print("CREATING SESSION IN JOIN ROOM:", self.request.session.items())  # Debugging line
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)
        if not code:
            return Response({'error': 'No room code provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            room = Room.objects.get(code=code)
            self.request.session[SESSION_ROOM_CODE] = room.code
            return Response({'message': 'Room joined successfully'}, status=status.HTTP_200_OK)
        except Room.DoesNotExist:
            return Response({'error': 'Invalid room code'}, status=status.HTTP_404_NOT_FOUND)

class RoomDetail(APIView):
    """
    API endpoint to get details of a specific room.
    """
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        print("SESSION DATA:", self.request.session.items())  # Debugging line

        code = request.GET.get(self.lookup_url_kwarg)
        if not code:
            return Response({'error': 'No room code provided'}, status=status.HTTP_400_BAD_REQUEST)

        if not self.request.session.exists(self.request.session.session_key):
            return Response({'error': 'You are not in a session'}, status=status.HTTP_403_FORBIDDEN)

        if SESSION_ROOM_CODE not in self.request.session:
            return Response({'error': 'You are not in a room'}, status=status.HTTP_403_FORBIDDEN)

        rooms = Room.objects.filter(code=code)
        if rooms.exists():
            data = RoomSerializer(rooms.first()).data
            data['is_host'] = self.request.session.session_key == rooms.first().host
            return Response(data, status=status.HTTP_200_OK)

        return Response(data={'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)

class UserRoomStatus(APIView):
    """
    API endpoint to check if a user is in a room.
    """
    def get(self, request, format=None):
        print("SESSION DATA:", self.request.session.items())  # Debugging line

        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        rooms = Room.objects.filter(code=self.request.session.get(SESSION_ROOM_CODE))
        if rooms.exists():
            return JsonResponse({'code': self.request.session.get(SESSION_ROOM_CODE)}, status=status.HTTP_200_OK)
        else:
            self.request.session.pop(SESSION_ROOM_CODE, None)
            return Response({'error': 'You were in an non-existing room'}, status=status.HTTP_400_BAD_REQUEST)

class LeaveRoom(APIView):
    """
    API endpoint to leave the current room.
    """
    def post(self, request, format=None):
        print("SESSION DATA:", self.request.session.items())  # Debugging line

        if not self.request.session.exists(self.request.session.session_key):
            return Response({'error': 'You are not in a session'}, status=status.HTTP_403_FORBIDDEN)

        if SESSION_ROOM_CODE not in self.request.session:
            return Response({'error': 'You are not in a room'}, status=status.HTTP_403_FORBIDDEN)

        self.request.session.pop(SESSION_ROOM_CODE, None)
        host = self.request.session.session_key
        try:
            room = Room.objects.get(host=host)
            room.delete()
        except Room.DoesNotExist:
            pass  # If room doesn't exist, do nothing
        return Response({'message': 'Successfully left the room'}, status=status.HTTP_200_OK)

class UpdateRoom(APIView):
    """
    API endpoint to update an existing room for the host.
    """
    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):
        print("SESSION DATA:", self.request.session.items())  # Debugging line

        if not self.request.session.exists(self.request.session.session_key):
            return Response({'error': 'You are not in a session'}, status=status.HTTP_403_FORBIDDEN)

        if SESSION_ROOM_CODE not in self.request.session:
            return Response({'error': 'You are not in a room'}, status=status.HTTP_403_FORBIDDEN)

        try:
            room = Room.objects.get(code=self.request.session.get(SESSION_ROOM_CODE))
            if self.request.session.session_key != room.host:
                return Response({'error': 'You are not the host'}, status=status.HTTP_403_FORBIDDEN)

            serializer = self.serializer_class(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            room.guest_can_pause = serializer.validated_data['guest_can_pause']
            room.votes_to_skip = serializer.validated_data['votes_to_skip']
            # Use update_fields for better performance under the hood
            room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
        except Room.DoesNotExist:
            return Response(data={'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(data=RoomSerializer(room).data, status=status.HTTP_200_OK)
