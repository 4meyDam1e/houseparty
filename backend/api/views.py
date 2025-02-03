from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer


# Create your views here.

class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        # create a new session if needed
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():  # validate request data
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)

            if queryset.exists():  # update existing room if it exists
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:  # otherwise, create a new room with the given data
                room = Room(
                    host=host,
                    guest_can_pause=guest_can_pause,
                    votes_to_skip=votes_to_skip
                )
                room.save()
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        return Response(RoomSerializer(room).data, status=status.HTTP_400_BAD_REQUEST)

class JoinRoomView(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            rooms = Room.objects.filter(code=code)
            if len(rooms) > 0:
                self.request.session['room_code'] = code
                return Response({ 'message': 'Room Joined!' }, status=status.HTTP_200_OK)
            return Response({ 'Room Not Found': 'Invalid Room Code.' }, status=status.HTTP_404_NOT_FOUND)
        return Response({ 'Bad Request': 'No Room Code Given.' }, status=status.HTTP_400_BAD_REQUEST)

class GetRoomView(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            rooms = Room.objects.filter(code=code)
            if len(rooms) > 0:
                data = RoomSerializer(rooms[0]).data
                data['is_host'] = self.request.session.session_key == rooms[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({ 'Room Not Found': 'Invalid Room Code.' }, status=status.HTTP_404_NOT_FOUND)
        return Response({ 'Bad Request': 'No Room Code Given.' }, status=status.HTTP_400_BAD_REQUEST)
