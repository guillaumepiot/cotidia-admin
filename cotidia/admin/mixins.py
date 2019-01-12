from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect
from django.conf import settings


class UserCheckMixin(object):
    def check_user(self, user):
        return True

    def dispatch(self, request, *args, **kwargs):
        if not self.check_user(request.user):
            if request.user.is_authenticated:
                raise PermissionDenied
            else:
                return redirect(settings.ACCOUNT_ADMIN_LOGIN_URL)

        return super().dispatch(request, *args, **kwargs)


class StaffPermissionRequiredMixin(UserCheckMixin):

    def get_permission_required(self, view=None):
        obj = view or self
        if obj.kwargs.get("permission_required"):
            return obj.kwargs["permission_required"]
        elif hasattr(obj, "permission_required"):
            return obj.permission_required
        else:
            return None

    def check_permissions(self, user, view=None):

        permission_required = self.get_permission_required(view)

        if type(permission_required) is list:
            for p in permission_required:
                if user.has_perm(p):
                    return True
        else:
            return user.has_perm(permission_required)

    def check_user(self, user):
        """Check if the user has the relevant permissions."""

        if user.is_superuser:
            return True

        return user.is_staff and self.check_permissions(user)

    def has_permission(self, request, view):
        """REST FRAMEWORK permission handling"""
        if request.user.is_superuser:
            return True

        return request.user.is_staff and self.check_permissions(request.user, view)
