from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings

class Command(BaseCommand):
    help = 'Send a test email to verify SMTP configuration'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Email address to send test to')

    def handle(self, *args, **options):
        email = options['email']
        self.stdout.write(f"Sending test email to {email}...")
        
        try:
            send_mail(
                subject='VoiceAI Test Email - SMTP Verification',
                message='This is a test email from your VoiceAI application. If you received this, your SMTP settings are correct!',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
            self.stdout.write(self.style.SUCCESS(f"Successfully sent test email to {email}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to send email: {str(e)}"))
