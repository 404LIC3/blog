package com.alice.blog.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String content;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String image;

    private LocalDateTime createdAt = LocalDateTime.now();

    // getter e setter
}
