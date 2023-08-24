import React from 'react';
import {
  Pagination
 } from 'react-bootstrap';


function ChapterPagination({ data }) {
  let chapters = data.reduce((chs, word) => {
    if (!chs.includes(word.chapter)) {
      chs.push(word.chapter)
    }

    return chs
  }, []).sort((a, b) => a - b);

  console.log(chapters)

  return (
    <Pagination size="sm">
      {/* <Pagination.First />
      <Pagination.Prev />
      <Pagination.Item>{1}</Pagination.Item>
      <Pagination.Ellipsis />

      <Pagination.Item>{10}</Pagination.Item>
      <Pagination.Item>{11}</Pagination.Item>
      <Pagination.Item active>{12}</Pagination.Item>
      <Pagination.Item>{13}</Pagination.Item>
      <Pagination.Item disabled>{14}</Pagination.Item>

      <Pagination.Ellipsis />
      <Pagination.Item>{20}</Pagination.Item>
      <Pagination.Next />
      <Pagination.Last /> */}

      {chapters.map(ch => (
        <Pagination.Item>{ch}</Pagination.Item>
      ))}
    </Pagination>
  );
}

export default ChapterPagination;
