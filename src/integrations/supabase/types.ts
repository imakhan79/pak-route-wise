export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      contracts: {
        Row: {
          id: string
          customer_id: string | null
          start_date: string
          end_date: string
          status: string | null
          terms_conditions: string | null
          rates_json: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          customer_id?: string | null
          start_date: string
          end_date: string
          status?: string | null
          terms_conditions?: string | null
          rates_json?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          customer_id?: string | null
          start_date?: string
          end_date?: string
          status?: string | null
          terms_conditions?: string | null
          rates_json?: Json | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          id: string
          name: string
          contact_person: string | null
          email: string | null
          phone: string | null
          address: string | null
          tax_id: string | null
          credit_limit: number | null
          payment_terms: string | null
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          tax_id?: string | null
          credit_limit?: number | null
          payment_terms?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          tax_id?: string | null
          credit_limit?: number | null
          payment_terms?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Relationships: []
      }
      drivers: {
        Row: {
          id: string
          full_name: string
          license_number: string
          license_expiry: string | null
          phone: string | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          full_name: string
          license_number: string
          license_expiry?: string | null
          phone?: string | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          license_number?: string
          license_expiry?: string | null
          phone?: string | null
          status?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      incidents: {
        Row: {
          id: string
          shipment_id: string | null
          type: string
          severity: string | null
          description: string | null
          status: string | null
          resolution_notes: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          shipment_id?: string | null
          type: string
          severity?: string | null
          description?: string | null
          status?: string | null
          resolution_notes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          shipment_id?: string | null
          type?: string
          severity?: string | null
          description?: string | null
          status?: string | null
          resolution_notes?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          id: string
          shipment_id: string | null
          customer_id: string | null
          amount: number
          status: string | null
          due_date: string | null
          items_json: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          shipment_id?: string | null
          customer_id?: string | null
          amount: number
          status?: string | null
          due_date?: string | null
          items_json?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          shipment_id?: string | null
          customer_id?: string | null
          amount?: number
          status?: string | null
          due_date?: string | null
          items_json?: Json | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          organization_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          organization_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          organization_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      routes: {
        Row: {
          id: string
          name: string
          origin_name: string
          destination_name: string
          distance_km: number | null
          checkpoints_json: Json | null
          approved_corridors_json: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          origin_name: string
          destination_name: string
          distance_km?: number | null
          checkpoints_json?: Json | null
          approved_corridors_json?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          origin_name?: string
          destination_name?: string
          distance_km?: number | null
          checkpoints_json?: Json | null
          approved_corridors_json?: Json | null
          created_at?: string | null
        }
        Relationships: []
      }
      seal_events: {
        Row: {
          id: string
          seal_id: string | null
          shipment_id: string | null
          event_type: string
          location: string | null
          description: string | null
          photo_url: string | null
          occurred_at: string | null
          reported_by: string | null
        }
        Insert: {
          id?: string
          seal_id?: string | null
          shipment_id?: string | null
          event_type: string
          location?: string | null
          description?: string | null
          photo_url?: string | null
          occurred_at?: string | null
          reported_by?: string | null
        }
        Update: {
          id?: string
          seal_id?: string | null
          shipment_id?: string | null
          event_type?: string
          location?: string | null
          description?: string | null
          photo_url?: string | null
          occurred_at?: string | null
          reported_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seal_events_seal_id_fkey"
            columns: ["seal_id"]
            isOneToOne: false
            referencedRelation: "seals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seal_events_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seal_events_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seals: {
        Row: {
          id: string
          seal_number: string
          type: string | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          seal_number: string
          type?: string | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          seal_number?: string
          type?: string | null
          status?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      shipment_documents: {
        Row: {
          id: string
          shipment_id: string | null
          type: string
          document_number: string | null
          file_url: string
          expiry_date: string | null
          status: string | null
          uploaded_by: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          shipment_id?: string | null
          type: string
          document_number?: string | null
          file_url: string
          expiry_date?: string | null
          status?: string | null
          uploaded_by?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          shipment_id?: string | null
          type?: string
          document_number?: string | null
          file_url?: string
          expiry_date?: string | null
          status?: string | null
          uploaded_by?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipment_documents_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          id: string
          shipment_id: string
          customer_id: string | null
          contract_id: string | null
          origin: string
          destination: string
          route_id: string | null
          commodity: string | null
          hs_code: string | null
          weight: number | null
          packages: number | null
          container_number: string | null
          vehicle_id: string | null
          driver_id: string | null
          eta: string | null
          etd: string | null
          pld: string | null
          incoterms: string | null
          insurance_policy: string | null
          status: Database["public"]["Enums"]["shipment_status"] | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          shipment_id: string
          customer_id?: string | null
          contract_id?: string | null
          origin: string
          destination: string
          route_id?: string | null
          commodity?: string | null
          hs_code?: string | null
          weight?: number | null
          packages?: number | null
          container_number?: string | null
          vehicle_id?: string | null
          driver_id?: string | null
          eta?: string | null
          etd?: string | null
          pld?: string | null
          incoterms?: string | null
          insurance_policy?: string | null
          status?: Database["public"]["Enums"]["shipment_status"] | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          shipment_id?: string
          customer_id?: string | null
          contract_id?: string | null
          origin?: string
          destination?: string
          route_id?: string | null
          commodity?: string | null
          hs_code?: string | null
          weight?: number | null
          packages?: number | null
          container_number?: string | null
          vehicle_id?: string | null
          driver_id?: string | null
          eta?: string | null
          etd?: string | null
          pld?: string | null
          incoterms?: string | null
          insurance_policy?: string | null
          status?: Database["public"]["Enums"]["shipment_status"] | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_locations: {
        Row: {
          id: string
          vehicle_id: string
          latitude: number
          longitude: number
          speed_kmh: number | null
          heading: number | null
          accuracy_m: number | null
          altitude_m: number | null
          battery_level: number | null
          connection_status: string | null
          engine_status: string | null
          recorded_at: string
          created_at: string | null
        }
        Insert: {
          id?: string
          vehicle_id: string
          latitude: number
          longitude: number
          speed_kmh?: number | null
          heading?: number | null
          accuracy_m?: number | null
          altitude_m?: number | null
          battery_level?: number | null
          connection_status?: string | null
          engine_status?: string | null
          recorded_at: string
          created_at?: string | null
        }
        Update: {
          id?: string
          vehicle_id?: string
          latitude?: number
          longitude?: number
          speed_kmh?: number | null
          heading?: number | null
          accuracy_m?: number | null
          altitude_m?: number | null
          battery_level?: number | null
          connection_status?: string | null
          engine_status?: string | null
          recorded_at?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_locations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          id: string
          registration_number: string
          type: string | null
          capacity_weight: number | null
          capacity_volume: number | null
          status: string | null
          fitness_expiry: string | null
          insurance_expiry: string | null
          created_at: string | null
          tracking_token: string | null
        }
        Insert: {
          id?: string
          registration_number: string
          type?: string | null
          capacity_weight?: number | null
          capacity_volume?: number | null
          status?: string | null
          fitness_expiry?: string | null
          insurance_expiry?: string | null
          created_at?: string | null
          tracking_token?: string | null
        }
        Update: {
          id?: string
          registration_number?: string
          type?: string | null
          capacity_weight?: number | null
          capacity_volume?: number | null
          status?: string | null
          fitness_expiry?: string | null
          insurance_expiry?: string | null
          created_at?: string | null
          tracking_token?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      vehicle_latest_locations: {
        Row: {
          id: string | null
          vehicle_id: string | null
          latitude: number | null
          longitude: number | null
          speed_kmh: number | null
          heading: number | null
          accuracy_m: number | null
          altitude_m: number | null
          battery_level: number | null
          connection_status: string | null
          engine_status: string | null
          recorded_at: string | null
          created_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_locations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      shipment_status:
        | "pending"
        | "approved"
        | "in_transit"
        | "customs_hold"
        | "cleared"
        | "delivered"
        | "cancelled"
      user_role:
        | "admin"
        | "operations_manager"
        | "compliance_officer"
        | "finance"
        | "customer"
        | "driver"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      shipment_status: [
        "pending",
        "approved",
        "in_transit",
        "customs_hold",
        "cleared",
        "delivered",
        "cancelled",
      ],
      user_role: [
        "admin",
        "operations_manager",
        "compliance_officer",
        "finance",
        "customer",
        "driver",
      ],
    },
  },
} as const
