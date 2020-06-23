let kafrMap = document.getElementById('kafrMap'),
    sakhaMap = document.getElementById('sakhaMap'),
    kafrButton = document.getElementById('kafrButton'),
    sakhaButton = document.getElementById('sakhaButton')
sakhaButton.addEventListener('click', () => {
    sakhaButton.classList.add('active')
    kafrButton.classList.remove('active')
    kafrMap.classList.add('disabeled')
    sakhaMap.classList.remove('disabeled')
})

kafrButton.addEventListener('click', () => {
    kafrButton.classList.add('active')
    sakhaButton.classList.remove('active')
    sakhaMap.classList.add('disabeled')
    kafrMap.classList.remove('disabeled')
})