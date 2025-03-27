import { gql } from '../__generated__'

export const GET_CHARACTERS = gql(`
    query GetCharacters($page: Int, $filter: FilterCharacter) {
        characters(page: $page, filter: $filter) {
            info {
                next
            }
            results {
                id
                name
                species
                status
                gender
                origin {
                name
                }
            }
        }
    }    
`)