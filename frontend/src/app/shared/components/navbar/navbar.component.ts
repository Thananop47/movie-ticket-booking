import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/models/interfaces';
import { AuthService } from '../../../core/services/auth.service';
import { Router,RouterModule } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  isLoggedIn = false;
  isAdmin = false;
 
  constructor(private authService: AuthService, private router: Router) {}
 
  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'admin';
    });
  }
 
  logout() {
    this.authService.logout();
  }
}
