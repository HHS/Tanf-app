"""Define user model."""

import uuid

from django.contrib.auth.models import AbstractUser, Group
from django.db import models
from tdpservice.stts.models import STT, Region


class User(AbstractUser):
    """Define user fields and methods."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    requested_roles = models.ManyToManyField(
        "auth.Group", related_name="users_requested"
    )
    stt = models.ForeignKey(STT, on_delete=models.CASCADE, blank=True, null=True)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        """Return the username as the string representation of the object."""
        return self.username

    @property
    def is_admin(self):
        """Check if the user is an admin."""
        # TODO: Probably better to change this to check for a permission
        # rather than the admin group directly.
        return (
            self.is_superuser or Group.objects.get(name="OFA Admin") in self.groups.all()
        )
