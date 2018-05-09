from django import forms


class ActionForm(forms.Form):
    def __init__(self, action_list, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["actions"] = forms.ChoiceField(
            choices=action_list,
            required=False,
            label=""
        )
