from django.shortcuts import render, HttpResponse

# Create your views here.

def homepage(request):
    return render(request, template_name='main/home.html')

def itemspage(request):
    items = [
        {
            'name': 'Phone',
            'price': '500'
        },
        {
            'name': 'Laptop',
            'price': '1000'
        }
    ]
    return render(request, template_name='main/items.html', context = {'items': items})


