import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { PetSpecies } from '@modules/pets/domain/value-objects/pet-species.vo';

@ApiSchema({
  description: 'Response DTO containing pet information',
})
export class PetResponseDTO {
  @ApiProperty({
    description: 'Unique identifier of the pet',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the pet',
    example: 'Max',
  })
  name: string;

  @ApiProperty({
    description: 'Species of the pet',
    enum: PetSpecies,
    example: PetSpecies.DOG,
  })
  species: PetSpecies;

  @ApiProperty({
    description: 'Breed of the pet',
    example: 'Golden Retriever',
  })
  breed: string;

  @ApiProperty({
    description: 'Birth date of the pet',
    example: '2020-01-15T00:00:00.000Z',
  })
  birthDate: Date;

  @ApiProperty({
    description: 'Weight of the pet in kilograms',
    example: 25.5,
    required: false,
  })
  weight?: number;

  @ApiProperty({
    description: 'URL or path to the pet photo',
    example: 'https://example.com/photos/pet123.jpg',
    required: false,
  })
  photo?: string;

  @ApiProperty({
    description: 'Additional notes about the pet',
    example: 'Allergic to chicken',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    description: 'Date when the pet record was created',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  createdAt?: Date;
}
