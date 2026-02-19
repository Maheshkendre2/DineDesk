import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface FooterLink {
  label: string;
  href: string;
  icon?: string;
}

@Component({
  selector: 'app-login-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './login-footer.component.html',
  styleUrl: './login-footer.component.css'
})
export class LoginFooterComponent {
  currentYear = new Date().getFullYear();

  productLinks: FooterLink[] = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Security', href: '#security' },
    { label: 'Blog', href: '#blog' }
  ];

  companyLinks: FooterLink[] = [
    { label: 'About Us', href: '#about' },
    { label: 'Careers', href: '#careers' },
    { label: 'Contact', href: '#contact' },
    { label: 'Press', href: '#press' }
  ];

  legalLinks: FooterLink[] = [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Cookie Policy', href: '#cookies' },
    { label: 'GDPR', href: '#gdpr' }
  ];

  socialLinks: FooterLink[] = [
    { label: 'Twitter', href: '#twitter', icon: '𝕏' },
    { label: 'Facebook', href: '#facebook', icon: 'f' },
    { label: 'Instagram', href: '#instagram', icon: '📷' },
    { label: 'LinkedIn', href: '#linkedin', icon: 'in' }
  ];
}
