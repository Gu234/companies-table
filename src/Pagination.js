import React from 'react';

function buildPaginationButton(i, goToPage, currentPage, numberOfPages) {
    return <div className={`pagination-button ${currentPage === i ? 'selected' : ''}`}
        onClick={() => goToPage(i, numberOfPages)}
        key={i}>{i + 1}</div>
}

function buildPaginationArray(numberOfPages, currentPage, goToPage) {
    const
        buttons = [],
        firstPage = <div key={'a'} onClick={() => goToPage(0)}>{'|<'}</div>,
        lastPage = <div key={'b'} onClick={() => goToPage(numberOfPages - 1, numberOfPages)}>>|</div>,
        previousPage = <div key={'c'} onClick={() => goToPage(currentPage - 1, numberOfPages)}>&laquo;</div>,
        nextPage = <div key={'d'} onClick={() => goToPage(currentPage + 1, numberOfPages)}>&raquo;</div>,
        leftEllipsis = <div key={'e'} onClick={() => goToPage(currentPage - 2, numberOfPages)}>...</div>,
        rightEllipsis = <div key={'f'} onClick={() => goToPage(currentPage + 2, numberOfPages)}>...</div>

    if (numberOfPages < 2) return buttons

    buttons.push(firstPage, previousPage)

    for (let i = 0; i < numberOfPages; i++) {
        const button = buildPaginationButton(i, goToPage, currentPage, numberOfPages)

        if (numberOfPages < 8) {
            buttons.push(button)
        }
        else if (i === 0 || i === numberOfPages - 1) {
            buttons.push(button)
        }
        else if (currentPage < 4) {
            if (i < 5) buttons.push(button)
            else if (i === 5) buttons.push(rightEllipsis)
        }
        else if (currentPage > numberOfPages - 4) {
            if (i > numberOfPages - 6) buttons.push(button)
            else if (i === numberOfPages - 6) buttons.push(leftEllipsis)
        }
        else if (i > currentPage - 2 && i < currentPage + 2) {
            buttons.push(button)
        }
        else if (i === currentPage - 2)
            buttons.push(leftEllipsis)
        else if (i === currentPage + 2)
            buttons.push(rightEllipsis)
    }

    buttons.push(nextPage, lastPage)
    return buttons
}

export default function ({ goToPage, numberOfPages, currentPage }) {
    return (
        <div className="pagination">
            {buildPaginationArray(numberOfPages, currentPage, goToPage)}
        </div>
    )
}