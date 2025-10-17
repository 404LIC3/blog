import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Necessari per il template

import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {API_URL} from '../app.config';

// Ho spostato l'interfaccia qui per rendere il file auto-contenuto e pulito
export interface Post {
  id?: number;
  title: string;
  content: string;
  image?:string;
  createdAt?: string;
  category?:string;
}

@Component({
  selector: 'app-details',
  standalone: true, // Componente Standalone
  imports: [CommonModule, RouterLink, DatePipe], // Aggiungi moduli necessari per template
  templateUrl: './details.html',
  styleUrls: ['./details.css'] // Usa styleUrls
})
export class Details implements OnInit {

  // Stato del Post
  post = signal<Post | null>(null);
  isLoading = signal(true);

  // Dependency Injection con inject()
  private route = inject(ActivatedRoute);

  // Ottiene l'ID del post in modo reattivo dall'URL.
  // toSignal gestisce automaticamente la sottoscrizione/cancellazione dell'Observable.
  private postIdSignal = toSignal(
    this.route.paramMap.pipe(
      // Estrai l'ID, convertendolo subito in numero
      switchMap(params => of(Number(params.get('id'))))
    )
  );

  // ngOnInit è necessario per avviare il caricamento del post
  ngOnInit() {
    this.loadPost();
  }

  // CARICAMENTO POST
  async loadPost() {
    this.isLoading.set(true);
    // Leggi il valore del signal per l'ID
    const postId = this.postIdSignal();

    if (!postId || postId === -1 || isNaN(postId)) {
      console.error('ID del post non valido:', postId);
      this.post.set(null);
      this.isLoading.set(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${postId}`);
      if (!res.ok) {
        throw new Error(`Post non trovato (Status: ${res.status})`);
      }
      const data: Post = await res.json();
      this.post.set(data);
    } catch (err) {
      console.error('Errore caricamento post', err);
      this.post.set(null); // Segnala che non è stato trovato o errore
    } finally {
      this.isLoading.set(false);
    }
  }
}
