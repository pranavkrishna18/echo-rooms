import { mockRooms, Room } from "./mockData";

const STORAGE_KEY = "echoroom_custom_rooms";

function loadCustomRooms(): Room[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCustomRooms(rooms: Room[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
}

export function getAllRooms(): Room[] {
  return [...mockRooms, ...loadCustomRooms()];
}

export function addRoom(room: Omit<Room, "id" | "memberCount" | "postCount" | "topEmotion" | "createdBy">): Room {
  const custom = loadCustomRooms();
  const newRoom: Room = {
    ...room,
    id: `custom-${Date.now()}`,
    memberCount: 1,
    postCount: 0,
    topEmotion: "hopeful",
    createdBy: "user",
  };
  custom.push(newRoom);
  saveCustomRooms(custom);
  return newRoom;
}
