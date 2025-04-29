let sviFilmovi = [];

fetch('filmtv_movies.csv')
  .then(response => response.text())
  .then(csv => {
    const rezultat = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true
    });

    sviFilmovi = rezultat.data.map(film => ({
      title: film.title,
      year: Number(film.year),
      genre: film.genre,
      duration: Number(film.duration),
      country: film.country?.split(',').map(c => c.trim()) || [],
      rating: Number(film.avg_vote)
    }));

    prikaziFilmove(sviFilmovi.slice(0, 20));
  })
  .catch(error => {
    console.error('Greška pri dohvatu ili parsiranju CSV datoteke:', error);
  });


function prikaziFilmove(filmovi) {
  const tbody = document.querySelector('#filmovi-tablica tbody');
  tbody.innerHTML = '';

  for (const film of filmovi) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${film.title}</td>
      <td>${film.year}</td>
      <td>${film.genre}</td>
      <td>${film.duration} min</td>
      <td>${film.country.join(', ')}</td>
      <td>${film.rating.toFixed(1)}</td>
      <td><button class="dodaj-kosarica">Dodaj</button></td>
    `;
    tbody.appendChild(row);

    row.querySelector('.dodaj-kosarica').addEventListener('click', () => {
      dodajUKosaricu(film);
    });
  }
}

let kosarica = []; 
function dodajUKosaricu(film) {
  if (!kosarica.includes(film)) {
    kosarica.push(film);
    osvjeziKosaricu();
  } else {
    alert("Film je već u košarici!");
  }
}

function osvjeziKosaricu() {
  const lista = document.getElementById('lista-kosarice');
  lista.innerHTML = '';

  kosarica.forEach((film, index) => {
    const li = document.createElement('li');
    li.textContent = `${film.title} (${film.year}) - ${film.genre}`;

    const ukloniBtn = document.createElement('button');
    ukloniBtn.textContent = 'Ukloni';
    ukloniBtn.style.marginLeft = '10px';
    ukloniBtn.addEventListener('click', () => {
      ukloniIzKosarice(index);
    });

    li.appendChild(ukloniBtn);
    lista.appendChild(li);
  });
}

// Uklanjanje filma iz košarice
function ukloniIzKosarice(index) {
  kosarica.splice(index, 1);
  osvjeziKosaricu();
}


document.getElementById('potvrdi-kosaricu').addEventListener('click', () => {
  if (kosarica.length === 0) {
    alert("Košarica je prazna!");
  } else {
    alert(`Uspješno ste odabrali ${kosarica.length} filmova za gledanje!`);
    kosarica = [];
    osvjeziKosaricu();
  }
});



function filtriraj() {
  const odabraniZanr = document.getElementById('filter-genre').value.trim().toLowerCase();
  const odabranaDrzava = document.getElementById('filter-country').value.trim().toLowerCase();
  const minimalnaOcjena = parseFloat(document.getElementById('filter-rating').value);

  const filtriraniFilmovi = sviFilmovi.filter(film => {
    const zanrMatch = !odabraniZanr || (film.genre && film.genre.toLowerCase().includes(odabraniZanr));
    const drzavaMatch = !odabranaDrzava || (film.country && film.country.some(c => c.toLowerCase().includes(odabranaDrzava)));
    const ocjenaMatch = isNaN(minimalnaOcjena) || film.rating >= minimalnaOcjena;

    return zanrMatch && drzavaMatch && ocjenaMatch;
  });

  prikaziFilmove(filtriraniFilmovi);
}
// "Filtriraj" button
document.getElementById('primijeni-filtere').addEventListener('click', filtriraj);


