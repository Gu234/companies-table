import React from 'react';

function buildPaginationButton(i, goToPage, currentPage, numberOfPaginationButtons) {
    return <div className={`pagination-button ${currentPage === i ? 'selected' : ''}`}
        onClick={() => goToPage(i, numberOfPaginationButtons)}
        key={i}>{i + 1}</div>
}

function buildPaginationArray(numberOfPaginationButtons, currentPage, goToPage) {
    const
        buttonsArr = [],
        firstPage = <div key={'a'} onClick={() => goToPage(0)}>{'|<'}</div>,
        lastPage = <div key={'b'} onClick={() => goToPage(numberOfPaginationButtons - 1, numberOfPaginationButtons)}>>|</div>,
        previousPage = <div key={'c'} onClick={() => goToPage(currentPage - 1, numberOfPaginationButtons)}>&laquo;</div>,
        nextPage = <div key={'d'} onClick={() => goToPage(currentPage + 1, numberOfPaginationButtons)}>&raquo;</div>,
        leftEllipsis = <div key={'e'} onClick={() => goToPage(currentPage - 2, numberOfPaginationButtons)}>...</div>,
        rightEllipsis = <div key={'f'} onClick={() => goToPage(currentPage + 2, numberOfPaginationButtons)}>...</div>

    if (numberOfPaginationButtons < 2) return buttonsArr

    buttonsArr.push(firstPage, previousPage)

    for (let i = 0; i < numberOfPaginationButtons; i++) {
        const button = buildPaginationButton(i, goToPage, currentPage, numberOfPaginationButtons)

        if (numberOfPaginationButtons < 8) {
            buttonsArr.push(button)
        }
        else if (i === 0 || i === numberOfPaginationButtons - 1) {
            buttonsArr.push(button)
        }
        else if (currentPage < 4) {
            if (i < 5) buttonsArr.push(button)
            else if (i === 5) buttonsArr.push(rightEllipsis)
        }
        else if (currentPage > numberOfPaginationButtons - 4) {
            if (i > numberOfPaginationButtons - 6) buttonsArr.push(button)
            else if (i === numberOfPaginationButtons - 6) buttonsArr.push(leftEllipsis)
        }
        else if (i > currentPage - 2 && i < currentPage + 2) {
            buttonsArr.push(button)
        }
        else if (i === currentPage - 2)
            buttonsArr.push(leftEllipsis)
        else if (i === currentPage + 2)
            buttonsArr.push(rightEllipsis)
    }

    buttonsArr.push(nextPage, lastPage)
    return buttonsArr
}

export default function ({ goToPage, numberOfPaginationButtons, currentPage }) {
    return (
        <div className="pagination">
            {buildPaginationArray(numberOfPaginationButtons, currentPage, goToPage)}
        </div>
    )
}