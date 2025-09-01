const mm = require('music-metadata-browser');

async function loadFileMetadata(file) {
  try {
    const metadata = await mm.parseBlob(file, { native: true });
    let pictureUrl = 'assets/default-cover.jpg';
    if (metadata.common.picture && metadata.common.picture[0]) {
      const picture = metadata.common.picture[0];
      const blob = new Blob([picture.data], { type: picture.format });
      pictureUrl = URL.createObjectURL(blob);
    }
    return {
      file,
      url: URL.createObjectURL(file),
      metadata: {
        title: metadata.common.title,
        artist: metadata.common.artist,
        picture: pictureUrl
      }
    };
  } catch (error) {
    console.error('Error parsing metadata:', error);
    return {
      file,
      url: URL.createObjectURL(file),
      metadata: {
        title: file.name,
        artist: 'Unknown Artist',
        picture: 'assets/default-cover.jpg'
      }
    };
  }
}

module.exports = { loadFileMetadata };