export interface Launch {
  flight_number: number;
  mission_name: string;
  details: string | null;
  rocket?: {
    rocket_name?: string;
  };
  links?: {
    mission_patch?: string | null;
    mission_patch_small?: string | null;
  };
}
