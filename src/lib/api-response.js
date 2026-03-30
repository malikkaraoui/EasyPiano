/**
 * Format de réponse API standardisé pour EasyPiano.
 * { success: boolean, data: object|null, error: string|null }
 */

export function successResponse(data, status = 200) {
  return Response.json({ success: true, data, error: null }, { status });
}

export function errorResponse(message, status = 400) {
  return Response.json(
    { success: false, data: null, error: message },
    { status },
  );
}

export function createdResponse(data) {
  return successResponse(data, 201);
}
