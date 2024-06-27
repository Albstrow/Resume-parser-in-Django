import os
from django.shortcuts import render, redirect
from pyresparser import ResumeParser
from .models import Resume, UploadResumeModelForm
from django.contrib import messages
from django.conf import settings
from django.db import IntegrityError
from django.db.models import Q
from django.urls import reverse_lazy
from django.contrib.auth.views import LoginView, PasswordResetView, PasswordChangeView
from django.contrib.messages.views import SuccessMessageMixin
from django.views import View
from django.contrib.auth.decorators import login_required
from .forms import RegisterForm, LoginForm, UpdateUserForm, UpdateProfileForm
import hashlib
import spacy

# Load the spaCy model
nlp = spacy.load('en_core_web_sm')


class RegisterView(View):
    form_class = RegisterForm
    initial = {'key': 'value'}
    template_name = 'parser_app/register.html'

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect(to='/')

        return super(RegisterView, self).dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        form = self.form_class(initial=self.initial)
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)

        if form.is_valid():
            form.save()

            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}')

            return redirect(to='login')

        return render(request, self.template_name, {'form': form})



class CustomLoginView(LoginView):
    form_class = LoginForm

    def form_valid(self, form):
        remember_me = form.cleaned_data.get('remember_me')
        if not remember_me:
            self.request.session.set_expiry(0)
            self.request.session.modified = True
        return super(CustomLoginView, self).form_valid(form)


class ResetPasswordView(SuccessMessageMixin, PasswordResetView):
    template_name = 'parser_app/password_reset.html'
    email_template_name = 'parser_app/password_reset_email.html'
    subject_template_name = 'parser_app/password_reset_subject'
    success_message = "We've emailed you instructions for setting your password, " \
                      "if an account exists with the email you entered. You should receive them shortly." \
                      " If you don't receive an email, " \
                      "please make sure you've entered the address you registered with, and check your spam folder."
    success_url = reverse_lazy('users-home')


class ChangePasswordView(SuccessMessageMixin, PasswordChangeView):
    template_name = 'parser_app/change_password.html'
    success_message = "Successfully Changed Your Password"
    success_url = reverse_lazy('users-home')


@login_required
def profile(request):
    if request.method == 'POST':
        user_form = UpdateUserForm(request.POST, instance=request.user)
        profile_form = UpdateProfileForm(request.POST, request.FILES, instance=request.user.profile)

        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            messages.success(request, 'Your profile is updated successfully')
            return redirect(to='users-profile')
    else:
        user_form = UpdateUserForm(instance=request.user)
        profile_form = UpdateProfileForm(instance=request.user.profile)

    return render(request, 'parser_app/profile.html', {'user_form': user_form, 'profile_form': profile_form})

@login_required
def homepage(request):
    q = request.GET.get('q') if request.GET.get('q') else ''
    resumes = Resume.objects.filter(  Q(user=request.user) & (Q(name__iregex=q) | Q(skills__iregex=q)))

    if request.method == 'POST':
        file_form = UploadResumeModelForm(request.POST, request.FILES)
        files = request.FILES.getlist('resume')
        resumes_data = []

        if file_form.is_valid():
            for file in files:
                try:
                    # Check for duplicate resume
                    hasher = hashlib.sha256()
                    for chunk in file.chunks():
                        hasher.update(chunk)
                    file_hash = hasher.hexdigest()

                    if Resume.objects.filter(user=request.user,file_hash=file_hash).exists():
                        messages.warning(request, f'Duplicate resume found: {file.name}')
                        continue

                    # Saving the file
                    resume = Resume(user=request.user, resume=file, file_hash=file_hash)
                    resume.save()

                    # Extracting resume entities
                    parser = ResumeParser(os.path.join(settings.MEDIA_ROOT, resume.resume.name))
                    data = parser.get_extracted_data()
                    resumes_data.append(data)
                    
                    resume.name = data.get('name')
                    resume.email = data.get('email')
                    resume.mobile_number = data.get('mobile_number')
                    resume.education = ', '.join(data.get('degree')) if data.get('degree') else None
                    resume.company_name = ', '.join(data.get('company_names')) if data.get('company_names') else None
                    resume.college_name = data.get('college_name')
                    resume.designation = data.get('designation')
                    resume.total_experience = data.get('total_experience')
                    resume.skills = ', '.join(data.get('skills')) if data.get('skills') else None
                    resume.experience = ', '.join(data.get('experience')) if data.get('experience') else None
                    resume.save()
                except IntegrityError:
                    messages.warning(request, 'Duplicate resume found:', file.name)
                    return redirect('homepage')
            resumes = Resume.objects.all()
            messages.success(request, 'Resumes uploaded!')
            context = {
                'resumes': resumes,
            }
            return render(request, 'res.html', context)
    else:
        form = UploadResumeModelForm()
    return render(request, 'res.html', {'form': form,'resumes':resumes})


def home(request):
    if request.method=="GET":
        q = request.GET.get('q') if request.GET.get('q') != None else ''
        q = request.GET.get('q') 
        print(q)

        resumes = Resume.objects.filter()
        print(resumes)
    return render(request, "base.html", {'resumes':resumes})


def demo(request):
    return render(request,"index.html")

def contact(request):
    return render(request,'contact.html')

def main(request):
    return render(request,'index.html')

def search(request):
    pass


