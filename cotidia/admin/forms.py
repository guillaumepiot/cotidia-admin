from django import forms


class ActionForm(forms.Form):
    # actions = forms.ChoiceField(choices=[])

    def __init__(self, action_list, *args, **kwargs):
        super().__init__(*args, **kwargs)
        print(self.fields)
        self.fields["actions"] = forms.ChoiceField(choices=action_list, required=False)
