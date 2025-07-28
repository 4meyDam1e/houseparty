from django.urls import path
from .views import SpotifyAuthUrl, SpotifyRedirect, SpotifyRefreshToken

urlpatterns = [
    path(route='auth-url/', view=SpotifyAuthUrl.as_view(), name='spotify-auth-url'),
    path(route='redirect/', view=SpotifyRedirect.as_view(), name='spotify-redirect'),
    path(route='refresh-token/', view=SpotifyRefreshToken.as_view(), name='spotify-refresh-token')
]
