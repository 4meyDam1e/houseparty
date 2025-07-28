from django.shortcuts import render, redirect
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from requests import Request, post
from .models import SpotifyToken


class SpotifyAuthUrl(APIView):
    """
    API endpoint to get the Spotify authorization request URL.
    """

    def get(self, request, format=None):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
        url = Request(
            method='GET',
            url='https://accounts.spotify.com/authorize',
            params={
                'client_id': settings.CLIENT_ID,
                'response_type': 'code',
                'redirect_uri': settings.REDIRECT_URI,
                'state': self.request.session.session_key,
                'scope': scopes
            }
        ).prepare().url
        return Response(data={'url': url}, status=status.HTTP_200_OK)


class SpotifyRedirect(APIView):
    """
    API endpoint to request Spotify access token.
    NOTE: This is the redirect URI upon authorization/authentication, set on Spotify Dashboard (https://developer.spotify.com/dashboard).
    """

    def get(self, request, format=None):
        code = request.GET.get('code')
        state = request.GET.get('state')

        if not code or not state:
            return Response(data={'error': 'Authorization code and state are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Restore session using state (DO NOT create new session key)
            self.request.session = self.request.session.__class__(state)
            # fallback, shouldn't occur
            if not self.request.session.exists(self.request.session.session_key):
                self.request.session.create()

            # Request access token
            response = post(
                url='https://accounts.spotify.com/api/token',
                data={
                    'client_id': settings.CLIENT_ID,
                    'client_secret': settings.CLIENT_SECRET,
                    'grant_type': 'authorization_code',
                    'code': code,
                    'redirect_uri': settings.REDIRECT_URI
                }
            ).json()

            access_token = response.get('access_token')
            token_type = response.get('token_type')
            refresh_token = response.get('refresh_token')
            expires_in = response.get('expires_in')
            # error = response.get('error')

            expires_in = timezone.now() + timedelta(seconds=expires_in)

            SpotifyToken.objects.update_or_create(
                user=self.request.session.session_key,
                defaults={
                    'access_token': access_token,
                    'token_type': token_type,
                    'refresh_token': refresh_token,
                    'expires_in': expires_in
                }
            )

            return redirect(settings.FRONTEND_URL)
        except Exception as error:
            # error = error if error else 'Failed to fetch tokens from Spotify'
            return Response(data={'error': str(error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SpotifyRefreshToken(APIView):
    """
    API endpoint to refresh user's Spotify tokens if expired (user has to be authenticated).
    """

    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            return Response(data={'error': 'You are not in a session'}, status=status.HTTP_403_FORBIDDEN)

        try:
            tokens = SpotifyToken.objects.filter(user=self.request.session.session_key)
            if tokens.exists():
                if tokens.expires_in > timezone.now():
                    return Response(data={'message': 'Token yet to expire'}, status=status.HTTP_200_OK)
            else:
                return Response(data={'error': 'No tokens to refresh'}, status=status.HTTP_404_NOT_FOUND)

            # Refresh token
            response = post(
                url='https://accounts.spotify.com/api/token',
                data={
                    'client_id': settings.CLIENT_ID,
                    'client_secret': settings.CLIENT_SECRET,
                    'grant_type': 'refresh_token',
                    'refresh_token': tokens.refresh_token,
                }
            ).json()

            access_token = response.get('access_token')
            token_type = response.get('token_type')
            refresh_token = response.get('refresh_token')
            expires_in = response.get('expires_in')
            error = response.get('error')

            SpotifyToken.objects.update_or_create(
                user=self.request.session.session_key,
                defaults={
                    'access_token': access_token,
                    'token_type': token_type,
                    'refresh_token': refresh_token,
                    'expires_in': expires_in
                }
            )
            return Response(data={'message': 'Tokens refreshed successfully'}, status=status.HTTP_200_OK)
        except Exception as error:
            error = error if error else 'Failed to refresh Spotify tokens'
            return Response(data={'error': str(error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)