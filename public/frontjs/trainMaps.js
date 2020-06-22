let kafrMap = document.getElementsByClassName('kafr'),
    sakhaMap = document.getElementsByClassName('sakha'),
    kafrButton = document.getElementById('kafr'),
    sakhaButton = document.getElementById('sakha')
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