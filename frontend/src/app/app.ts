import { Component, signal } from '@angular/core';
import { API_URL } from './app.config';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Post {
  id?: number;
  title: string;
  content: string;
  createdAt?: string;
}

@Component({
  selector: 'app-root',
  imports: [ FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true
})
export class App {
  posts  = signal<Post[]>([]);
  newPostTitle = signal('');
  newPostContent = signal('');

  showLogin = false;
  isAdmin = false;
  username = '';
  password = '';

  constructor() {
    this.loadPosts().catch(err => console.error(err));
  }


  // CARICAMENTO POST
  async loadPosts() {
    try {
      const res = await fetch(API_URL);
      const data: Post[] = await res.json();
      this.posts.set(data);
    } catch (err) {
      console.error('Errore caricamento post', err);
    }
  }

  // LOGIN
  async login() {
    if (!this.username || !this.password) return alert('Inserisci username e password');

    try {
      const res = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa(`${this.username}:${this.password}`)
        }
      });

      if (res.ok) {
        this.isAdmin = true;
        this.showLogin = false;
        alert('Login riuscito! Ora puoi creare/eliminare post.');
      } else {
        alert('Credenziali errate');
      }
    } catch (err) {
      console.error(err);
      alert('Errore di login');
    }
  }

  // AGGIUNTA POST
  async addPost() {
    if (!this.isAdmin) return alert('Devi essere admin!');
    if (!this.newPostTitle() || !this.newPostContent()) return;

    const newPost = {
      title: this.newPostTitle(),
      content: this.newPostContent()
    };

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${this.username}:${this.password}`)
        },
        body: JSON.stringify(newPost)
      });

      this.newPostTitle.set('');
      this.newPostContent.set('');
      await this.loadPosts();
    } catch (err) {
      console.error('Errore creazione post', err);
    }
  }



  // ELIMINA POST
  async deletePost(id: number) {
    if (!this.isAdmin) return alert('Devi essere admin!');

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa(`${this.username}:${this.password}`)
        }
      });

      await this.loadPosts();
    } catch (err) {
      console.error('Errore eliminazione post', err);
    }
  }
}
