import type { IStorage } from "../storage";
import { GoogleApiAuthModel } from "../models";
import {
    ensureConnection,
    getNextSequence,
    toPlain,
} from "../helpers/db-helpers";
import mongoose from "mongoose";

export const authApiStorage = {
    async saveAPIGoogleAuthTokens(tokens: {
        accessToken: string;
        refreshToken: string;
        expiryDate: number;
        email: string;
    }) {
        await ensureConnection();

        // ✅ DEBUG: database & collection details
        console.log("[oauthapi][db] connection:", {
            dbName: mongoose.connection.name,
            host: mongoose.connection.host,
            port: mongoose.connection.port,
        });

        console.log("[oauthapi][db] model info:", {
            modelName: GoogleApiAuthModel.modelName,
            collectionName: GoogleApiAuthModel.collection.name,
        });

        const existing: any = await GoogleApiAuthModel.findOne();

        if (existing) {
            existing.accessToken = tokens.accessToken;
            existing.expiryDate = tokens.expiryDate;
            existing.email = tokens.email;

            // ✅ don't overwrite refresh token with empty value
            if (tokens.refreshToken && tokens.refreshToken.trim().length > 0) {
                existing.refreshToken = tokens.refreshToken;
            }

            // ✅ remove calendarId if present from old data
            if ("calendarId" in existing) {
                existing.calendarId = undefined;
            }

            await existing.save();
            return toPlain(existing);
        }

        const id = await getNextSequence("google_auth_tokens");

        const created = await GoogleApiAuthModel.create({
            id,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken || "",
            expiryDate: tokens.expiryDate,
            email: tokens.email,
        });

        return toPlain(created);
    },

    async getAPIGoogleAuthTokens() {
        await ensureConnection();

        // ✅ DEBUG: collection used on read
        console.log("[oauthapi][db] read from collection:", {
            collectionName: GoogleApiAuthModel.collection.name,
        });

        const row = await GoogleApiAuthModel.findOne().lean();
        return row ?? null;
    },
} satisfies Pick<IStorage, "saveAPIGoogleAuthTokens" | "getAPIGoogleAuthTokens">;
