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

export function deleteRoom(roomId: string) {
  // Remove from custom rooms
  const custom = loadCustomRooms().filter(r => r.id !== roomId);
  saveCustomRooms(custom);
  // Remove posts for this room
  try {
    const stored = localStorage.getItem("echoroom_posts");
    if (stored) {
      const all = JSON.parse(stored).filter((p: any) => p.roomId !== roomId);
      localStorage.setItem("echoroom_posts", JSON.stringify(all));
    }
  } catch {}
}

export function isDefaultRoom(roomId: string): boolean {
  return mockRooms.some(r => r.id === roomId);
}
