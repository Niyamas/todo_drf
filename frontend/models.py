from django.db import models

from wagtail.core.models import Page


class HomePage(Page):
    """Home Page.

    Args:
        Page ([type]): [description]
    """

    templates = 'home/home_page.html'
    max_count = 1