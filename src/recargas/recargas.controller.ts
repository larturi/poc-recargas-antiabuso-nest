import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { RateLimitService } from '../rate-limit/rate-limit.service';

@Controller('api/validar-linea')
export class RecargasController {
  constructor(private readonly rateLimiter: RateLimitService) {}

  @Post()
  async validarLinea(@Body() body: any, @Res() res: Response) {
    const { numeroLinea, visitorId } = body;

    if (!visitorId || !numeroLinea) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Faltan datos' });
    }

    // Verifica si el visitorId está bloqueado
    // Este visitorId ya está castigado y bloqueado preventivamente por RATE_LIMIT_BLOCK_DURATION_SECONDS minutos?”
    // Si es sí, ni lo dejamos avanzar, 429 (Too Many Requests).
    if (await this.rateLimiter.isBlocked(visitorId)) {
      return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
        error: 'Demasiados intentos. Intentá más tarde.',
      });
    }

    // Verifica si puede seguir intentando
    // Cuántas veces consultó este visitorId en los últimos RATE_LIMIT_DURATION_SECONDS?
    // Si son más de RATE_LIMIT_MAX_REQUESTS, se lo bloquea por RATE_LIMIT_BLOCK_DURATION_SECONDS.
    const allowed = await this.rateLimiter.isAllowed(visitorId);
    if (!allowed) {
      await this.rateLimiter.block(visitorId);
      return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
        error: 'Límite superado. Acceso bloqueado temporalmente.',
      });
    }

    // Simulación de validación de línea (ejemplo)
    const lineaValida = Math.random() > 0.3;

    if (!lineaValida) {
      await new Promise((r) => setTimeout(r, 1000)); // Delay artificial para errores
      return res.status(400).json({
        success: false,
        data: {
          mensaje: 'Línea no válida',
          numero: numeroLinea,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        mensaje: 'Línea válida',
        numero: numeroLinea,
      },
    });
  }
}
