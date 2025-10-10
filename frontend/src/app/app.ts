import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { API_URL } from './app.config';
import { FormsModule } from '@angular/forms';
import {NgForOf} from '@angular/common';


interface Post {
  id?: number;
  title: string;
  content: string;
  createdAt?: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, NgForOf],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true
})
export class App {
  protected readonly title = signal('frontend');

  posts = signal<Post[]>([]);
  newPostTitle = signal('');
  newPostContent = signal('');

  constructor() {
    this.loadPosts();
  }

  async loadPosts() {
    try {
      const res = await fetch(API_URL);
      const data: Post[] = await res.json();
      this.posts.set(data);
    } catch (err) {
      console.error('Errore caricamento post', err);
    }
  }

  async addPost() {
    if (!this.newPostTitle() || !this.newPostContent()) return;

    const newPost: Post = {
      title: this.newPostTitle(),
      content: this.newPostContent()
    };

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      this.newPostTitle.set('');
      this.newPostContent.set('');
      this.loadPosts();
    } catch (err) {
      console.error('Errore creazione post', err);
    }
  }

  async deletePost(id: number) {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      this.loadPosts();
    } catch (err) {
      console.error('Errore eliminazione post', err);
    }
  }
}
