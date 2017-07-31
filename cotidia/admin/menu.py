class Menu(object):

    def __init__(self):
        self._registry = []

    def register(self, title, template, order=None):
        self._registry.append({
            'title': title,
            'template': template,
            'order': order
            })

    def items(self):
        item_list = []
        menu_list = sorted(self._registry, key=lambda k: k['order'])
        for item in menu_list:
            item_list.append(item['template'])
        return item_list

menu = Menu()
