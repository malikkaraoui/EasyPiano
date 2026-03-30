import { verifyAuth } from "@/services/auth-server";
import { errorResponse } from "@/lib/api-response";

/**
 * Middleware d'authentification pour API Routes.
 * Vérifie le token Firebase et injecte l'utilisateur dans le handler.
 *
 * @param {Function} handler - (request, user) => Response
 * @param {{ role?: string }} options - Options (rôle requis)
 */
export function withAuth(handler, options = {}) {
  return async (request) => {
    const user = await verifyAuth(request);

    if (!user) {
      return errorResponse("Non autorisé", 401);
    }

    if (options.role && user.role !== options.role) {
      return errorResponse("Accès refusé", 403);
    }

    return handler(request, user);
  };
}
