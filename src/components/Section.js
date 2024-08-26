import React from 'react';
import './Section.css'; // Include specific styles for Section

const Section = ({ title, content }) => {
  // Split content by newline characters to handle numbered items
  const contentLines = content.split('\n');

  return (
    <section className="section">
      <h1>{title}</h1>
      {contentLines.map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </section>
  );
};

export default Section;
