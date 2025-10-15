import {Component, signal} from '@angular/core';
import {API_URL} from '../app.config';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Post} from '../types';




@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  posts  = signal<Post[]>([]);
  searchQuery = signal('');

  isAdmin = true;
  username = 'admin';
  password = '123';

  constructor() {
    this.loadPosts().catch(err => console.error(err));
  }

  // Getter per i post filtrati
  get filteredPosts(): Post[] {
    const query = this.searchQuery().toLowerCase();
    return this.posts().filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query)
    ).map((post) =>{
      post.content = post.content.length < 150 ? post.content : post.content.substring(0,150)+"..."
      return post;
    });
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
