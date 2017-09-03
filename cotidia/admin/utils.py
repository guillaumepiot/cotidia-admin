from cotidia.account.conf import settings
from django.shortcuts import redirect
from django.core.exceptions import PermissionDenied


class UserCheckMixin(object):

    def check_user(self, user):
        return True

    def dispatch(self, request, *args, **kwargs):
        if not self.check_user(request.user):
            if request.user.is_authenticated():
                raise PermissionDenied
            else:
                return redirect(settings.ACCOUNT_ADMIN_LOGIN_URL)
        return super().dispatch(request, *args, **kwargs)


class StaffPermissionRequiredMixin(UserCheckMixin):

    def get_permission_required(self):
        return None

    def check_user(self, user):
        """Check if the user has the relevant permissions."""
        if user.is_superuser:
            return True
        return user.is_staff and user.has_perm(self.get_permission_required())
