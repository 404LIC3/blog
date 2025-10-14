import { Component, signal } from '@angular/core';
import { API_URL } from './app.config';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Post {
  id?: number;
  title: string;
  content: string;
  image?:string;
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
  newPostImage = signal<File | null>(null);
  searchQuery = signal(''); // Segnale per la barra di ricerca


  showLogin = false;
  isAdmin = false;
  username = '';
  password = '';

  constructor() {
    this.loadPosts().catch(err => console.error(err));
  }


 // Getter per i post filtrati
  get filteredPosts(): Post[] {
    const query = this.searchQuery().toLowerCase();
    return this.posts().filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query)
    );
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

    const imageFile = this.newPostImage();
    let imageBase64: string | null = null;

    if (imageFile) {
      imageBase64 = await this.convertToBase64(imageFile);
    }

    const newPost = {
      title: this.newPostTitle(),
      content: this.newPostContent(),
      image: imageBase64
    };

    try {
      await fetch(API_URL, {
        method: 'POST', //GET POST DELETE PUT
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${this.username}:${this.password}`)
        },
        body: JSON.stringify(newPost)
      });

      // reset campi
      this.newPostTitle.set('');
      this.newPostContent.set('');
      this.newPostImage.set(null);

      await this.loadPosts();
    } catch (err) {
      console.error('Errore creazione post', err);
    }
  }



  //immagine post - anteprima base64
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.newPostImage.set(input.files[0]);
    } else {
      this.newPostImage.set(null);
    }
  }


  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
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
