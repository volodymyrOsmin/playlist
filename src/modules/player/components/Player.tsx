import { Paper, Typography, TextField, FormControl } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as React from 'react';

import { Track, ALL_TRACKS, TrackListType } from '../models';
import TrackList from './TrackList';

const PlayerWrapper = styled(Paper)(() => ({
  width: 600,
  margin: 'auto',
  padding: 50,
  minHeight: 500,
}));

const PlayerHeader = styled(Typography)(() => ({
  textTransform: 'uppercase',
  fontWeight: 'bold',
  fontSize: 24,
}));

const SearchBarWrapper = styled(FormControl)(() => ({
  width: '300px',
  marginTop: '20px',
}));

const Player = () => {
  const [trackList, setTrackList] = React.useState<Track[]>(ALL_TRACKS);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [playlist, setPlaylist] = React.useState<Track[]>([]);

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalizedSearchValue = e.target.value.toLowerCase();
    setSearchValue(normalizedSearchValue);

    if (normalizedSearchValue.length > 0) {
      const searchedTracks = ALL_TRACKS.filter((track) =>
        track.title.toLowerCase().includes(normalizedSearchValue)
      );
      setTrackList(searchedTracks);
    } else {
      setTrackList(ALL_TRACKS);
    }
  };

  const handleAddTrack = (trackId: string) => {
    const track = trackList.find((t) => t.id === trackId);

    const isExist = playlist.some((track: Track) => track.id === trackId);

    if (!track || isExist) return;

    setPlaylist((prevPlaylist) => [...prevPlaylist, track]);
  };

  const handleRemoveTrack = (trackId: string) => {
    setPlaylist((prevTracks) => prevTracks.filter((t) => t.id !== trackId));
  };

  const handleTrackListSelect = (trackId: string, isSelected: boolean) => {
    const updatedTracks = (tracks: Track[]) =>
      tracks.map((track) =>
        track.id === trackId ? { ...track, isSelected } : track
      );

    setTrackList(updatedTracks);
  };

  const handlePlaylistTrackSelect = (trackId: string, isSelected: boolean) => {
    const updatedTracks = (tracks: Track[]) =>
      tracks.map((track) =>
        track.id === trackId ? { ...track, isSelected } : track
      );

    setPlaylist(updatedTracks);
  };

  const handleBulkAddTrack = () => {
    const selectedTracks = trackList
      .filter((track) => track.isSelected)
      .map((track) => ({ ...track, isSelected: false }));

    setPlaylist((prevPlaylist) => [
      ...prevPlaylist.filter(
        (track: Track) =>
          !selectedTracks.some(
            (selectedTrack: Track) => track.id === selectedTrack.id
          )
      ),
      ...selectedTracks,
    ]);
    setTrackList((prevTracks) =>
      prevTracks.map((track) => ({ ...track, isSelected: false }))
    );
  };

  const handleBulkRemoveTrack = () => {
    setPlaylist((prevTracks) =>
      prevTracks.filter((track) => !track.isSelected)
    );
  };

  return (
    <PlayerWrapper>
      <PlayerHeader>Create your own unique playlist</PlayerHeader>

      <SearchBarWrapper>
        <TextField
          label="Search"
          variant="outlined"
          value={searchValue}
          onChange={onSearchInputChange}
        />
      </SearchBarWrapper>

      {trackList.length ? (
        <TrackList
          tracks={trackList}
          onTrackSelect={handleTrackListSelect}
          onActionTrack={handleAddTrack}
          onBulkActionTrack={handleBulkAddTrack}
          listType={TrackListType.GENERAL_PLAYLIST}
        />
      ) : searchValue.length ? (
        <Typography style={{ marginTop: '20px' }}>Not found</Typography>
      ) : null}

      {!!playlist.length && (
        <TrackList
          tracks={playlist}
          onTrackSelect={handlePlaylistTrackSelect}
          onActionTrack={handleRemoveTrack}
          onBulkActionTrack={handleBulkRemoveTrack}
          listType={TrackListType.PERSONAL_PLAYLIST}
        />
      )}
    </PlayerWrapper>
  );
};

export default Player;
