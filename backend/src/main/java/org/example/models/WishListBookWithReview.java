package org.example.models;

// models/WishListBookDetail.java
public record WishListBookWithReview(
        long id,
        String title,
        String author,
        Integer pubYear,
        String isbn13,
        Integer pages,
        String review_text     // null when the user hasn't reviewed this book
//        Integer star_rating
) {}
