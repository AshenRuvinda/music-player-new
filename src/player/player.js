document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const playlist = document.getElementById('playlist');
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const coverArt = document.getElementById('cover-art');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
  
    let songs = [];
    let currentIndex = -1;
  
    fileInput.addEventListener('change', async (event) => {
      const files = Array.from(event.target.files);
      const newSongs = await Promise.all(files.map(file => loadFileMetadata(file)));
      songs = songs.concat(newSongs.filter(song => song));
      updatePlaylist();
    });
  
    function updatePlaylist() {
      playlist.innerHTML = '';
      songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = `${song.metadata.title || song.file.name} - ${song.metadata.artist || 'Unknown Artist'}`;
        li.addEventListener('click', () => playSong(index));
        playlist.appendChild(li);
      });
      updateButtons();
    }
  
    async function playSong(index) {
      if (index < 0 || index >= songs.length) return;
  
      currentIndex = index;
      const song = songs[index];
      audioPlayer.src = song.url;
      await audioPlayer.play();
      playPauseBtn.textContent = 'Pause';
  
      // Update UI
      songTitle.textContent = song.metadata.title || song.file.name;
      songArtist.textContent = song.metadata.artist || 'Unknown Artist';
      coverArt.src = song.metadata.cover || 'assets/default-cover.jpg';
  
      // Highlight current song
      const lis = playlist.querySelectorAll('li');
      lis.forEach((li, i) => {
        li.classList.toggle('playing', i === index);
      });
      updateButtons();
    }
  
    playPauseBtn.addEventListener('click', () => {
      if (audioPlayer.paused) {
        if (currentIndex === -1 && songs.length > 0) {
          playSong(0);
        } else {
          audioPlayer.play();
          playPauseBtn.textContent = 'Pause';
        }
      } else {
        audioPlayer.pause();
        playPauseBtn.textContent = 'Play';
      }
    });
  
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        playSong(currentIndex - 1);
      }
    });
  
    nextBtn.addEventListener('click', () => {
      if (currentIndex < songs.length - 1) {
        playSong(currentIndex + 1);
      }
    });
  
    audioPlayer.addEventListener('ended', () => {
      if (currentIndex < songs.length - 1) {
        playSong(currentIndex + 1);
      } else {
        playPauseBtn.textContent = 'Play';
        updateButtons();
      }
    });
  
    function updateButtons() {
      prevBtn.disabled = currentIndex <= 0;
      nextBtn.disabled = currentIndex >= songs.length - 1 || songs.length === 0;
      playPauseBtn.disabled = songs.length === 0;
    }
  });