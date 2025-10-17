import {Component, signal} from '@angular/core';
import {API_URL} from '../app.config';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Post} from '../types';
import {SlicePipe} from '@angular/common';
import {AuthService} from '../auth.service';




@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    FormsModule,
    SlicePipe
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  posts  = signal<Post[]>([]);
  searchQuery = signal('');
  categories = signal<string[]>(['Tecnologia', 'Moda', 'Cucina', 'Viaggi', 'Musica']); // Esempio
  selectedCategory = signal<string>(''); // Categoria selezionata




  constructor(private authService: AuthService) {
    this.loadPosts().catch(err => console.error(err));
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get filteredPosts(): Post[] {
    const query = this.searchQuery().toLowerCase();
    const category = this.selectedCategory(); // <-- definito qui

    return this.posts()
      .filter(post =>
        (post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query)) &&
        (!category || post.category === category) // <-- filtraggio categorie
      )
      .sort((a, b) =>
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      )
      .map(post => ({
        ...post,
        content: post.content.length < 150
          ? post.content
          : post.content.substring(0, 150) + "..."
      }));
  }


  // CARICAMENTO POST
  async loadPosts() {
    try {
      const res = await fetch(API_URL);
      const data: Post[] = await res.json();

      // Assicura che ogni post abbia sempre una categoria
      this.posts.set(data.map(p => ({
        ...p,
        category: p.category || 'Generale'
      })));
    } catch (err) {
      console.error('Errore caricamento post', err);
    }
  }


  // ELIMINA POST
  async deletePost(id: number) {
    if (!this.authService.isAdmin()) return alert('Devi essere admin!');

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: this.authService.getAuthHeaders()
      });

      await this.loadPosts();
    } catch (err) {
      console.error('Errore eliminazione post', err);
    }
  }
}
