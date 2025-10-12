package com.alice.blog.controllers;
import org.springframework.security.access.prepost.PreAuthorize;



import com.alice.blog.entities.Post;
import com.alice.blog.repositories.PostRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:4200") // per Angular
public class PostController {

    private final PostRepository repository;


    public PostController(PostRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Post> all() {
        return repository.findAll();
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Post create(@RequestBody Post post) {
        return repository.save(post);
    }

    @GetMapping("/{id}")
    public Post get(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
