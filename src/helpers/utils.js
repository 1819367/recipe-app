import React from 'react'

export const truncateText = (text, numWords = 20) => {
  
    const words = text.split(" "); //creates an array
    if (words.length <= numWords) {
        return text;
    } else {
        return words.slice(0, numWords).join(" ") + "...";
    }
};

