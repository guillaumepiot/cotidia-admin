from django.test import TestCase, Client
from django.core.urlresolvers import reverse

from cotidia.account import fixtures
from {{app_label}}.models import {{model_name}}
from {{app_label}}.factory import {{model_name}}Factory


class {{model_name}}AdminTests(TestCase):

    @fixtures.superuser
    def setUp(self):

        # Create a default object, to use with update, retrieve, list & delete
        self.object = {{model_name}}Factory.create()

        # Create the client and login the user
        self.c = Client()
        self.c.login(
            username=self.superuser.username,
            password=self.superuser_pwd)

    def test_add_{{model_name|lower}}(self):
        """Test that we can add a new object."""

        url = reverse('{{app_label}}-admin:{{model_name}}-add')

        # Test that the page load first
        response = self.c.get(url)
        self.assertEqual(response.status_code, 200)

        # Send data
        data = {
            {% for field in fields %}"{{field.1}}": "<<SETME>>",{% if not forloop.last %}
            {% endif %}{% endfor %}
        }
        response = self.c.post(url, data)
        self.assertEqual(response.status_code, 302)

        # Get the latest added object
        obj = {{model_name}}.objects.filter().latest('id')
        {% for field in fields %}self.assertEqual(obj.{{field.1}}, "<<SETME>>"){% if not forloop.last %}
        {% endif %}{% endfor %}

    def test_update_{{model_name|lower}}(self):
        """Test that we can update an existing object."""

        url = reverse(
            '{{app_label}}-admin:{{model_name|lower}}-update',
            kwargs={
                'pk': self.object.id
            }
        )

        # Test that the page load first
        response = self.c.get(url)
        self.assertEqual(response.status_code, 200)

        # Send data
        data = {
            {% for field in fields %}"{{field.1}}": "<<SETME>>",{% if not forloop.last %}
            {% endif %}{% endfor %}
        }
        response = self.c.post(url, data)
        self.assertEqual(response.status_code, 302)

        # Get the latest added object
        obj = {{model_name}}.objects.get(id=self.object.id)

        {% for field in fields %}self.assertEqual(obj.{{field.1}}, "<<SETME>>"){% if not forloop.last %}
        {% endif %}{% endfor %}

    def test_retrieve_{{model_name|lower}}(self):
        """Test that we can retrieve an object from its ID."""

        url = reverse(
            '{{app_label}}-admin:{{model_name|lower}}-detail',
            kwargs={
                'pk': self.object.id
            }
        )

        # Test that the page load first
        response = self.c.get(url)
        self.assertEqual(response.status_code, 200)

    def test_list_{{model_name|lower}}(self):
        """Test that we can list objects."""

        url = reverse('{{app_label}}-admin:{{model_name|lower}}-list')

        # Test that the page load first
        response = self.c.get(url)
        self.assertEqual(response.status_code, 200)

    def test_delete_{{model_name|lower}}(self):
        """Test that we can delete an object."""

        url = reverse(
            '{{app_label}}-admin:{{model_name|lower}}-delete',
            kwargs={
                'pk': self.object.id
            }
        )

        # Test that the page load first
        response = self.c.get(url)
        self.assertEqual(response.status_code, 200)

        # Action detail with POST call
        response = self.c.post(url)
        self.assertEqual(response.status_code, 302)

        # Test that the record has been deleted
        obj = {{model_name}}.objects.filter(id=self.object.id)
        self.assertEqual(obj.count(), 0)
