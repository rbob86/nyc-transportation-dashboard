import { SDKResponse, IError } from '@looker/sdk-rtl'
import { IValidationError } from '@looker/sdk'

import sdk from '../utils/sdk'

const getStations = (): Promise<
    SDKResponse<string, IError | IValidationError>
> => {
    return sdk.run_inline_query({
        result_format: 'json',
        body: {
            model: 'nyc_transportation',
            view: 'citibike_trips',
            fields: [
                'citibike_trips.start_station_id',
                'citibike_trips.start_station_location',
                'citibike_trips.start_station_name',
                'citibike_trips.count',
                'citibike_trips.total_tripduration_in_days',
                'citibike_trips.average_tripduration_in_minutes',
            ],
            total: false,
        },
        cache: true,
    })
}

export { getStations }
