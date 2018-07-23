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
    def get_permission_required(self):
        if hasattr(self, "permission_required"):
            return self.permission_required

        return None

    def check_permissions(self, user):
        permission_required = self.get_permission_required()

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
