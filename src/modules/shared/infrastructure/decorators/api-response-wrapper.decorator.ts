import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiCreatedResponse,
  getSchemaPath,
} from '@nestjs/swagger';

export const ApiWrappedResponse = <TModel extends Type<any>>(
  model: TModel,
  statusCode: number = 200,
) => {
  const decorator = statusCode === 201 ? ApiCreatedResponse : ApiOkResponse;

  return applyDecorators(
    ApiExtraModels(model),
    decorator({
      schema: {
        allOf: [
          {
            properties: {
              success: {
                type: 'boolean',
                example: true,
              },
              statusCode: {
                type: 'number',
                example: statusCode,
              },
              timestamp: {
                type: 'string',
                example: '2025-10-26T10:30:00.000Z',
              },
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiWrappedArrayResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              success: {
                type: 'boolean',
                example: true,
              },
              statusCode: {
                type: 'number',
                example: 200,
              },
              timestamp: {
                type: 'string',
                example: '2025-10-26T10:30:00.000Z',
              },
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
